import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { updateProfile, updatePassword } from "@/store/auth-slice";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { User, Lock, Mail, ShieldCheck, Camera, Loader2 } from "lucide-react";
import { useUploadThing } from "@/helpers/uploadthing";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function UserProfile() {
  const { user } = useSelector((state) => state.auth);
  const [profileFormData, setProfileFormData] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
  });

  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(user?.image || "");

  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleProfileUpdate(e) {
    e.preventDefault();
    dispatch(
      updateProfile({
        userId: user?.id,
        ...profileFormData,
        image: uploadedImageUrl
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Profile updated successfully",
        });
      } else {
        toast({
          title: data?.payload?.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    });
  }

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setImageLoading(false);
      if (res && res.length > 0) {
        setUploadedImageUrl(res[0].url);
        toast({
          title: "Avatar uploaded! Save profile to confirm."
        })
      }
    },
    onUploadError: () => {
      setImageLoading(false);
      toast({
        title: "Upload failed",
        variant: "destructive",
      });
    },
  });

  async function handleImageFileChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      setImageLoading(true);
      await startUpload([file]);
    }
  }

  function handlePasswordUpdate(e) {
    e.preventDefault();
    if (passwordFormData.newPassword !== passwordFormData.confirmNewPassword) {
      toast({
        title: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      updatePassword({
        userId: user?.id,
        oldPassword: passwordFormData.oldPassword,
        newPassword: passwordFormData.newPassword,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Password updated successfully",
        });
        setPasswordFormData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        toast({
          title: data?.payload?.message || "Failed to update password",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* PROFILE INFO */}
      <Card className="border-none shadow-none bg-muted/30">
        <CardHeader className="flex flex-col items-center">
            <div className="relative group mb-6">
                <Avatar className="w-32 h-32 border-4 border-primary/20 transition-all duration-500 group-hover:border-primary/40 shadow-xl overflow-hidden">
                    <AvatarImage src={uploadedImageUrl} className="object-cover" />
                    <AvatarFallback className="bg-muted text-2xl font-serif font-bold italic">
                        {user?.userName[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                
                {imageLoading ? (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                ) : (
                    <Label 
                        htmlFor="avatar-upload"
                        className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer shadow-lg transform transition-transform group-hover:scale-110"
                    >
                        <Camera size={16} />
                        <Input 
                            id="avatar-upload" 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={handleImageFileChange}
                        />
                    </Label>
                )}
            </div>

          <div className="flex items-center gap-3 mb-2 text-center flex-col">
             <div className="p-2 bg-primary/10 rounded-lg text-primary self-center">
                <User size={20} />
             </div>
             <CardTitle className="text-xl font-serif">Public Identity</CardTitle>
          </div>
          <CardDescription className="text-xs uppercase tracking-widest font-bold text-center">Customize how you appear in the sanctuary.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={profileFormData.userName}
                  onChange={(e) => setProfileFormData({ ...profileFormData, userName: e.target.value })}
                  className="pl-10 bg-background border-border"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={profileFormData.email}
                  onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                  className="pl-10 bg-background border-border"
                  placeholder="name@example.com"
                  type="email"
                />
              </div>
            </div>
            <Button type="submit" className="w-full text-xs uppercase tracking-widest font-bold h-12">
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* SECURITY */}
      <Card className="border-none shadow-none bg-muted/30">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <ShieldCheck size={20} />
             </div>
             <CardTitle className="text-xl font-serif">Security & Access</CardTitle>
          </div>
          <CardDescription className="text-xs uppercase tracking-widest font-bold">Update your password to stay secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={passwordFormData.oldPassword}
                  onChange={(e) => setPasswordFormData({ ...passwordFormData, oldPassword: e.target.value })}
                  className="pl-10 bg-background border-border"
                  placeholder="Enter current password"
                  type="password"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={passwordFormData.newPassword}
                  onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                  className="pl-10 bg-background border-border"
                  placeholder="Create new password"
                  type="password"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest font-bold opacity-60">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={passwordFormData.confirmNewPassword}
                  onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmNewPassword: e.target.value })}
                  className="pl-10 bg-background border-border"
                  placeholder="Re-type new password"
                  type="password"
                />
              </div>
            </div>
            <Button type="submit" className="w-full text-xs uppercase tracking-widest font-bold h-12">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserProfile;
