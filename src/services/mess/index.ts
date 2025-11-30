"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const createMess = async (payload: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/mess/create`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: (await cookies()).get("accessToken")!.value || "",
      },
      body: JSON.stringify(payload),
    }).then((x) => x.json());
    revalidateTag("mess", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const invitedUserToMess = async (
  messId: string,
  payload: FieldValues
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/mess/invite/${messId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: JSON.stringify(payload),
      }
    ).then((x) => x.json());
    revalidateTag("mess", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const shiftManagerRole = async (
  messId: string,
  payload: FieldValues
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/mess/shift-manager/${messId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: JSON.stringify(payload),
      }
    ).then((x) => x.json());
    revalidateTag("mess", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAllMess = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/mess`, {
      method: "GET",
      next: {
        tags: ["mess"],
      },
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value || "",
      },
    }).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAMess = async (messId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/mess/${messId}`,
      {
        method: "GET",
      }
    ).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateMessData = async (messId: string, payload: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/mess/update/${messId}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: JSON.stringify(payload),
      }
    ).then((x) => x.json());
    revalidateTag("mess", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const deleteMessData = async (messId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/mess/delete/${messId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    ).then((x) => x.json());
    revalidateTag("mess", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const removeMemberFromMess = async (messId: string, userId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/mess/remove-member-mess`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: JSON.stringify({ messId, userId }),
      }
    ).then((x) => x.json());
    revalidateTag("mess", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
