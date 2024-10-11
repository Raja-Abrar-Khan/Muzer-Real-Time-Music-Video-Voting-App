import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/app/lib/db";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { YT_REGEX } from "@/app/lib/utils";
import { getServerSession } from "next-auth";



const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(), //youtube spotify
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const isYt = data.url.match(YT_REGEX)
    if (!isYt) {
      return NextResponse.json(
        {
          message: "wrong url format",
        },
        {
          status: 411,
        }
      );
    }
    const extractedId = data.url.split("?v=")[1];

    const res=await youtubesearchapi.GetVideoDetails(extractedId);

    const thumbnails=res.thumbnail.thumbnails;
    thumbnails.sort((a: {width:number},b: {width:number})=>a.width<b.width ?-1:1);

    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube", // Ensure this matches the enum
        title: res.title ?? "can't find video",
        smallImg:(thumbnails.length>1 ? thumbnails[thumbnails.length-2].url :thumbnails[thumbnails.length-1].url)??"https://rukminim2.flixcart.com/image/850/1000/kufuikw0/poster/u/o/e/small-zoro-one-piece-attitude-in-blood-wall-poster-asstore-original-imag7k3ejvderef6.jpeg?q=90&crop=false",
        bigImg: thumbnails[thumbnails.length-1].url??"https://rukminim2.flixcart.com/image/850/1000/kufuikw0/poster/u/o/e/small-zoro-one-piece-attitude-in-blood-wall-poster-asstore-original-imag7k3ejvderef6.jpeg?q=90&crop=false"
      },
    });

    return NextResponse.json({
       ...stream,
       hasUpvoted: false,
       upvotes: 0

    });

  } catch (e) {
    console.log(e);
    return NextResponse.json({
      
      message: "Error While Adding a stream",
    }, {
      status: 411,
    });
  }
}


export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  const session = await getServerSession();
  const user = await prismaClient.user.findFirst({
      where: {
          email: session?.user?.email ?? ""
      }
  })

  if (!user) {
      return NextResponse.json({
          message: "Unauthenticated"
      }, {
          status: 403
      })
  }
  if(!creatorId){
    return NextResponse.json({
      message:"Error"
    },{
      status: 411
    })
  }
  const [streams,activeStream] =await Promise.all ([await prismaClient.stream.findMany({
    where: {
        userId: creatorId,
        played:false
    },
    include: {
        _count: {
            select: {
                upvotes: true
            }
        },
        upvotes:{
            where:{
                userId: user.id
            }
            
        }
    }
}),prismaClient.currentStream.findFirst({
  where:{
    userId: creatorId,
    
  },
  include:{
    stream: true
  }
})])

return NextResponse.json({
    streams: streams.map(({ _count, ...rest }) => (
        {
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted: rest.upvotes.length? true : false
        }
    )),
    activeStream
})
}

