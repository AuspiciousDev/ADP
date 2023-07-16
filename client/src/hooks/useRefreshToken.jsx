import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh");
    setAuth((prev) => {
      return {
        ...prev,
        username: response.data.username,
        userType: response.data.userType,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        imgURL: response.data.imgURL,
        accessToken: response.data.accessToken,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
