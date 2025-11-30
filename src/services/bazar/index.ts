"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const createBazar = async (messId: string, payload: FormData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/bazar/create/${messId}`,
      {
        method: "POST",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: payload,
      }
    ).then((x) => x.json());
    revalidateTag("bazar", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const addItemToBazar = async (messId: string, payload: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/bazar/add-item/${messId}`,
      {
        method: "POST",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: JSON.stringify(payload),
      }
    ).then((x) => x.json());
    revalidateTag("bazar", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const updatedBazar = async (messId: string, payload: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/bazar/update-item/${messId}`,
      {
        method: "PUT",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: JSON.stringify(payload),
      }
    ).then((x) => x.json());
    revalidateTag("bazar", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const deleteBazar = async (messId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/bazar/delete-item/${messId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    ).then((x) => x.json());
    revalidateTag("bazar", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const changeVerifyOfBazar = async (
  bazarId: string,
  payload: FieldValues
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/bazar/change-status/${bazarId}`,
      {
        method: "POST",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: JSON.stringify(payload),
      }
    ).then((x) => x.json());
    revalidateTag("bazar", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getBazarsByManager = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/bazar/get-bazar-manager`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    ).then((X) => X.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllBazarDataInMess = async (messId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/bazar/bazar-all/${messId}`,
      {
        method: "GET",
        next: {
          tags: ["bazar"],
        },
      }
    ).then((X) => X.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getABazarDataInMess = async (bazarId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/bazar/bazar/${bazarId}`,
      {
        method: "GET",
      }
    ).then((X) => X.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAllBazar = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/bazar/bazar-all`,
      {
        method: "GET",
      }
    ).then((X) => X.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
