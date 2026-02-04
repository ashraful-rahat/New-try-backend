import {
  CampaignResponse,
  CampaignStatsResponse,
  CreateCampaignDTO,
  UpdateCampaignDTO,
} from '../interfaces/campaign.interface';
import { cloudinary } from '../middleware/multer';
import { CampaignModel } from '../models/Campaign.model';

export class CampaignService {
  // =======================
  // Helper: format response (FIXED)
  // =======================
  private toResponseObject(doc: any) {
    // ✅ Return empty object instead of null
    if (!doc) {
      console.warn('⚠️ Warning: null document passed to toResponseObject');
      return this.getEmptyCampaign();
    }

    const obj = doc.toObject ? doc.toObject() : doc;

    // ✅ Add defensive checks for all required fields
    return {
      _id: obj._id?.toString() || '',
      title: obj.title || '',
      description: obj.description || '',
      images: obj.images || [],
      category: obj.category || '',
      type: obj.type || 'VOLUNTEER',
      startDate: obj.startDate || new Date(),
      endDate: obj.endDate,
      location: obj.location || '',
      volunteerLimit: obj.volunteerLimit,
      registeredVolunteers: obj.registeredVolunteers || 0,
      status: obj.status || 'UPCOMING',
      priority: obj.priority || 0,
      createdBy: {
        _id:
          obj.createdBy?._id?.toString() ||
          (typeof obj.createdBy === 'string' ? obj.createdBy : ''),
        name: obj.createdBy?.name || '',
        email: obj.createdBy?.email || '',
        role: obj.createdBy?.role || 'ADMIN', // ✅ Added missing role
      },
      createdAt: obj.createdAt || new Date(),
      updatedAt: obj.updatedAt || new Date(),
    };
  }

  // =======================
  // Helper: Get empty campaign object
  // =======================
  private getEmptyCampaign() {
    return {
      _id: '',
      title: '',
      description: '',
      images: [],
      category: '',
      type: 'VOLUNTEER' as const,
      startDate: new Date(),
      endDate: undefined,
      location: '',
      volunteerLimit: undefined,
      registeredVolunteers: 0,
      status: 'UPCOMING' as const,
      priority: 0,
      createdBy: {
        _id: '',
        name: '',
        email: '',
        role: 'ADMIN' as const,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // =======================
  // Create Campaign
  // =======================
  async createCampaign(data: CreateCampaignDTO, createdBy: string): Promise<CampaignResponse> {
    try {
      const campaign = await CampaignModel.create({
        ...data,
        createdBy,
        status: 'UPCOMING',
        registeredVolunteers: 0,
        priority: data.priority || 0,
      });

      return {
        success: true,
        message: 'ক্যাম্পেইন সফলভাবে তৈরি হয়েছে',
        campaign: this.toResponseObject(campaign),
      };
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      throw new Error(error.message || 'ক্যাম্পেইন তৈরি করতে সমস্যা হয়েছে');
    }
  }

  // =======================
  // Get All Campaigns (FIXED)
  // =======================
  async getAllCampaigns(status?: string, type?: string): Promise<CampaignResponse> {
    try {
      const query: any = {};

      if (status) query.status = status;
      if (type) query.type = type;

      const campaigns = await CampaignModel.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .populate('createdBy', 'name email role'); // ✅ Added role to populate

      // ✅ Return empty array instead of filtering nulls
      const responseObjects = campaigns.map((c) => this.toResponseObject(c));

      return {
        success: true,
        message: responseObjects.length ? 'সব ক্যাম্পেইন' : 'কোনো ক্যাম্পেইন নেই',
        campaigns: responseObjects,
      };
    } catch (error: any) {
      console.error('Error getting campaigns:', error);
      return {
        success: false,
        message: error.message || 'ক্যাম্পেইন পাওয়া যায়নি',
        campaigns: [],
      };
    }
  }

  // =======================
  // Get Active / Ongoing (FIXED)
  // =======================
  async getActiveCampaigns(): Promise<CampaignResponse> {
    try {
      const campaigns = await CampaignModel.find({
        status: 'ONGOING',
      })
        .sort({ priority: -1, createdAt: -1 })
        .populate('createdBy', 'name email role'); // ✅ Added role

      const responseObjects = campaigns.map((c) => this.toResponseObject(c));

      return {
        success: true,
        message: 'চলমান ক্যাম্পেইন',
        campaigns: responseObjects,
      };
    } catch (error: any) {
      console.error('Error getting active campaigns:', error);
      return {
        success: false,
        message: error.message || 'সক্রিয় ক্যাম্পেইন পাওয়া যায়নি',
        campaigns: [],
      };
    }
  }

  // =======================
  // Get Single Campaign (FIXED)
  // =======================
  async getCampaignById(id: string): Promise<CampaignResponse> {
    try {
      const campaign = await CampaignModel.findById(id).populate('createdBy', 'name email role'); // ✅ Added role

      if (!campaign) {
        return {
          success: false,
          message: 'ক্যাম্পেইন পাওয়া যায়নি',
        };
      }

      return {
        success: true,
        message: 'ক্যাম্পেইন পাওয়া গেছে',
        campaign: this.toResponseObject(campaign),
      };
    } catch (error: any) {
      console.error('Error getting campaign:', error);
      return {
        success: false,
        message: error.message || 'ক্যাম্পেইন পাওয়া যায়নি',
      };
    }
  }

  // =======================
  // Update Campaign (FIXED)
  // =======================
  async updateCampaign(id: string, data: UpdateCampaignDTO): Promise<CampaignResponse> {
    try {
      if (data.images?.length) {
        const existing = await CampaignModel.findById(id);
        if (existing?.images?.length) {
          await this.deleteImagesFromCloudinary(existing.images);
        }
      }

      const campaign = await CampaignModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true },
      ).populate('createdBy', 'name email role'); // ✅ Added role

      if (!campaign) {
        return {
          success: false,
          message: 'ক্যাম্পেইন পাওয়া যায়নি',
        };
      }

      return {
        success: true,
        message: 'ক্যাম্পেইন আপডেট হয়েছে',
        campaign: this.toResponseObject(campaign),
      };
    } catch (error: any) {
      console.error('Error updating campaign:', error);
      return {
        success: false,
        message: error.message || 'ক্যাম্পেইন আপডেট করা যায়নি',
      };
    }
  }

  // =======================
  // Update Campaign Status (FIXED)
  // =======================
  async updateCampaignStatus(id: string, status: string): Promise<CampaignResponse> {
    try {
      const validStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message: 'অবৈধ স্ট্যাটাস',
        };
      }

      const campaign = await CampaignModel.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      ).populate('createdBy', 'name email role'); // ✅ Added role

      if (!campaign) {
        return {
          success: false,
          message: 'ক্যাম্পেইন পাওয়া যায়নি',
        };
      }

      return {
        success: true,
        message: 'স্ট্যাটাস আপডেট হয়েছে',
        campaign: this.toResponseObject(campaign),
      };
    } catch (error: any) {
      console.error('Error updating status:', error);
      return {
        success: false,
        message: error.message || 'স্ট্যাটাস আপডেট করা যায়নি',
      };
    }
  }

  // =======================
  // Delete Campaign (FIXED)
  // =======================
  async deleteCampaign(id: string): Promise<CampaignResponse> {
    try {
      const campaign = await CampaignModel.findById(id);

      if (!campaign) {
        return {
          success: false,
          message: 'ক্যাম্পেইন পাওয়া যায়নি',
        };
      }

      if (campaign.images.length) {
        await this.deleteImagesFromCloudinary(campaign.images);
      }

      await campaign.deleteOne();

      return {
        success: true,
        message: 'ক্যাম্পেইন মুছে ফেলা হয়েছে',
      };
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      return {
        success: false,
        message: error.message || 'ক্যাম্পেইন ডিলিট করা যায়নি',
      };
    }
  }

  // =======================
  // Campaign Statistics (FIXED)
  // =======================
  async getCampaignStats(): Promise<CampaignStatsResponse> {
    try {
      const total = await CampaignModel.countDocuments();
      const upcoming = await CampaignModel.countDocuments({ status: 'UPCOMING' });
      const ongoing = await CampaignModel.countDocuments({ status: 'ONGOING' });
      const completed = await CampaignModel.countDocuments({ status: 'COMPLETED' });
      const cancelled = await CampaignModel.countDocuments({ status: 'CANCELLED' });

      return {
        success: true,
        message: 'ক্যাম্পেইন পরিসংখ্যান',
        stats: {
          total,
          upcoming,
          ongoing,
          completed,
          cancelled,
        },
      };
    } catch (error: any) {
      console.error('Error getting stats:', error);
      return {
        success: false,
        message: error.message || 'পরিসংখ্যান পাওয়া যায়নি',
        stats: {
          total: 0,
          upcoming: 0,
          ongoing: 0,
          completed: 0,
          cancelled: 0,
        },
      };
    }
  }

  // =======================
  // Cloudinary Cleanup
  // =======================
  private async deleteImagesFromCloudinary(images: Array<{ publicId: string }>) {
    for (const image of images) {
      if (image.publicId) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch {
          // ignore individual failures
        }
      }
    }
  }

  // =======================
  // Add Images (FIXED)
  // =======================
  async addImagesToCampaign(
    id: string,
    images: Array<{ url: string; publicId: string }>,
  ): Promise<CampaignResponse> {
    try {
      const campaign = await CampaignModel.findById(id);
      if (!campaign) {
        return {
          success: false,
          message: 'ক্যাম্পেইন পাওয়া যায়নি',
        };
      }

      const newImages = images.map((img, i) => ({
        ...img,
        order: campaign.images.length + i,
      }));

      campaign.images.push(...newImages);
      await campaign.save();

      return {
        success: true,
        message: 'ইমেজ যোগ করা হয়েছে',
        campaign: this.toResponseObject(campaign),
      };
    } catch (error: any) {
      console.error('Error adding images:', error);
      return {
        success: false,
        message: error.message || 'ইমেজ যোগ করা যায়নি',
      };
    }
  }

  // =======================
  // Remove Image (FIXED)
  // =======================
  async removeImageFromCampaign(id: string, publicId: string): Promise<CampaignResponse> {
    try {
      const campaign = await CampaignModel.findById(id);
      if (!campaign) {
        return {
          success: false,
          message: 'ক্যাম্পেইন পাওয়া যায়নি',
        };
      }

      const index = campaign.images.findIndex((img) => img.publicId === publicId);
      if (index === -1) {
        return {
          success: false,
          message: 'ইমেজ পাওয়া যায়নি',
        };
      }

      await cloudinary.uploader.destroy(publicId);
      campaign.images.splice(index, 1);
      campaign.images.forEach((img, i) => (img.order = i));
      await campaign.save();

      return {
        success: true,
        message: 'ইমেজ মুছে ফেলা হয়েছে',
        campaign: this.toResponseObject(campaign),
      };
    } catch (error: any) {
      console.error('Error removing image:', error);
      return {
        success: false,
        message: error.message || 'ইমেজ মুছতে সমস্যা হয়েছে',
      };
    }
  }
}
