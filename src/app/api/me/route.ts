import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Phuriphat Yoosuwan",
    studentId: "660610784",
  });
};
