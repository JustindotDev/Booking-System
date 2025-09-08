import { useRef } from "react";
import Contacts from "@/components/profile/profile-contacts-card";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { Camera } from "lucide-react";

import { Loader2 } from "lucide-react";

const Profile = () => {
  const { authUser, isUploading, uploadProfilePic } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64Image = reader.result;
        await uploadProfilePic(base64Image);
      };
    }
    return;
  };
  return (
    <SidebarInset>
      <SiteHeader title="My Profile" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6 flex flex-col space-y-4">
              {/* TODO: Card Placeholder for profile */}
              <Card>
                <CardContent className="flex items-center">
                  <div className="relative">
                    <Avatar className="w-24 h-24 mr-4 ">
                      <AvatarImage src={authUser?.profile_pic} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {isUploading ? (
                      // Spinner overlay
                      <div className="absolute bottom-0 right-4 bg-white rounded-full p-1">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                      </div>
                    ) : (
                      <Camera
                        className="h-6 w-6 absolute text-gray-500 bottom-0 right-4 bg-white rounded-full p-1 transition-transform duration-200 ease-in-out hover:bg-gray-100 hover:scale-105 cursor-pointer"
                        onClick={handleClick}
                      />
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleUploadProfilePic}
                      disabled={isUploading}
                    ></input>
                  </div>
                  <div>
                    <h2 className="scroll-m-20  text-lg font-semibold tracking-tight first:mt-0">
                      {authUser?.username}
                    </h2>
                    <p className="text-sm text-gray-500">Admin</p>
                    <p className="text-sm text-gray-500">{authUser?.email}</p>
                  </div>
                </CardContent>
              </Card>

              {/* <---- Contacts Sections ----> */}
              <Contacts />
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Profile;
