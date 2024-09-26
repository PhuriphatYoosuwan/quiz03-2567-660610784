import { Database, DB, Payload, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");
  const foundroomId = (<Database>DB).rooms.find(
    (x) => x.roomId === roomId);

  if(!foundroomId){
   return NextResponse.json(
     {
       ok: false,
       message: `Room is not found`,
     },
     { status: 404 }
   );
  }

  const foundMessage = (<Database>DB).messages.filter(
    (x) => x.roomId === roomId);

  return NextResponse.json(
    {
      ok: true,
      messages: foundMessage,
  },
  { status: 200 }
  );
};

export const POST = async (request: NextRequest) => {
  readDB();

  const body = await request.json();
  const {roomId} = body;
  const {messageText} = body;
  const foundroomId = (<Database>DB).rooms.find(
    (x) => x.roomId === roomId);

  if(!foundroomId){
   return NextResponse.json(
     {
       ok: false,
       message: `Room is not found`,
     },
     { status: 404 }
   );
  }

  const messageId = nanoid();
  (<Database>DB).messages.push({
    roomId,
    messageId,
    messageText,
  })

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId: messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();

  let role = null;
  role = (<Payload>payload).role;
  
  if(!payload || role === "ADMIN"){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
        },
        { status: 401 }
    );  
  }
 
  readDB();

  const body = await request.json();
  const {messageId} = body;
  const foundMessageIdindex = (<Database>DB).messages.findIndex(
    (x) => x.messageId === messageId);

  if(foundMessageIdindex === -1){
   return NextResponse.json(
     {
       ok: false,
       message: "Message is not found",
     },
     { status: 404 }
  );
  }
  
  (<Database>DB).messages.splice(foundMessageIdindex, 1);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
