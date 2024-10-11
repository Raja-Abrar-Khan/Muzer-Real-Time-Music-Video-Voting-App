import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import {NextResponse } from "next/server";

export async function GET(){
const session = await getServerSession();
const user = await prismaClient.user.findFirst({
    where: {
        email: session?.user?.email ?? ""
    }
});
console.log(user)

if (!user) {
    return NextResponse.json({
        message: "Unauthenticated"
    }, {
        status: 403
    })
}

console.log("User ID before query:", user.id);
console.log("Querying most upvoted stream for user...");
const mostUpvotedStream = await prismaClient.stream.findFirst({
    where: {
        userId: user.id,
        played: false
        
    },
    orderBy: {
        upvotes: {
            _count: 'desc'
        }
    }
});

console.log("After 2ndst call");
console.log(mostUpvotedStream);
await Promise.all([prismaClient.currentStream.upsert({
    where:{
        userId: user.id,
    },
    update:{
        userId: user.id,
        streamId: mostUpvotedStream?.id
    },
    create:{
        userId: user.id,
        streamId: mostUpvotedStream?.id
    }
}),prismaClient.stream.update({
    where:{
        id: mostUpvotedStream?.id ?? ""
    },
    data:{
      played: true,
      playedTs: new Date()
    }
    
})])

return NextResponse.json({
    stream: mostUpvotedStream
})
}