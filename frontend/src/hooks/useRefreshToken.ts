import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    setAuth(() => {
      return {
        role: response.data.role,
        accessToken: response.data.accessToken,
        id: response.data.id,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
