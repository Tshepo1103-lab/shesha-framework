import { useMutate } from "@/hooks";

export const useSegmentedActions = () => {
    const { mutate } = useMutate<any>();
  
    const updateUserSettings = async (updatedSettings: any, descriminator: string) => {
      try {
        const response = await mutate(
          {
            url: '/api/services/app/Settings/UpdateUserValue',
            httpVerb: 'POST',
          },
          {
            name: descriminator,
            module: 'Shesha',
            value: updatedSettings,
            datatype: 'string',
          }
        );
  
        if (response?.success) {
          return response;
        }
      } catch (error) {
        console.error('Error updating user settings:', error);
      }
    };
    const fetchUserSettings = async (descriminator: string) => {
      try {
        const response = await mutate(
          {
            url: '/api/services/app/Settings/GetUserValue',
            httpVerb: 'POST',
          },
          {
            name: descriminator,
            module: 'Shesha',
          }
        );
  
        if (response?.success && response?.result !== undefined) {
          return response;
        }
      } catch (error) {
        console.error('Error fetching column state:', error);
      }
    };
    return { fetchUserSettings, updateUserSettings };
  };
  