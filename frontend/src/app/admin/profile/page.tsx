import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";

const Profile = () => {
  return (
    <SidebarInset>
      <SiteHeader title="My Profile" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* TODO: Card Placeholder for profile */}
            <div className="px-4 lg:px-6 flex justify-center">
              <div className="w-11/12  items-center ">
                <div
                  className="   
              flex flex-col items-start gap-3 w-fit
              bg-white/80 px-3 py-2 rounded-lg shadow-sm
              md:flex-row md:gap-6"
                >
                  {/* Day-Off */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-400"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Day-Off
                    </span>
                  </div>

                  {/* Closed Days */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-300"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Closed Days
                    </span>
                  </div>

                  {/* Events */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-400"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Events
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default Profile;
