import StreamView from "@/app/components/StreamView";

export default function ({
    params: {
        creatorId
    }
}: {
    params: {
        creatorId: string;
    }
}) {
    return <div>
        <StreamView creatorId={creatorId} playVideo={false}/>
    </div>
}