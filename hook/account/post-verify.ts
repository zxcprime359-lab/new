import axios from "axios";
import { useMutation } from "@tanstack/react-query";

type VerifyPinInput = {
  profileId: string;
  pin: string;
};

type VerifyPinResponse = {
  success: boolean;
};

export function useVerifyPin() {
  return useMutation({
    mutationFn: async (input: VerifyPinInput) => {
      const res = await axios.post<VerifyPinResponse>(
        "/api/profiles/verify",
        input,
      );
      return res.data;
    },
  });
}
