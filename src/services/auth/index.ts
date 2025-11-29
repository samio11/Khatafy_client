"use server";

import { IUser } from "@/types/user";
import { jwtDecode } from "jwt-decode";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const userLogin = async (payload: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result?.success) {
      (await cookies()).set("accessToken", result?.data?.accessToken);
      (await cookies()).set("refreshToken", result?.data?.refreshToken);
    }
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    (await cookies()).delete("accessToken");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const userRegister = async (payload: FormData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/auth/register`,
      {
        method: "POST",
        body: payload,
      }
    );
    revalidateTag("user", "max");
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const kickedUser = async (userId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/auth/kick/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("user", "max");
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const unKickedUser = async (userId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/auth/un-kick/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("user", "max");
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    let decoded = null;
    if (token) {
      decoded = await jwtDecode<IUser>(token);
      return decoded;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const changeStatusToManager = async (userId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/auth/assign-manager/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("user", "max");
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAllUser = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/users`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      next: {
        tags: ["user"],
      },
    });
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAUser = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/user`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAdminState = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/auth/admin-state`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAdminUserState = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/auth/admin-user`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const changeUserData = async (payload: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/auth/user/update`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: JSON.stringify(payload),
      }
    );
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
