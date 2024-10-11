"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Play, Share2, Video } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import { Appbar } from "@/app/components/Appbar";
import { YT_REGEX } from "@/app/lib/utils";
import { randomUUID } from "crypto";
import StreamView from "@/app/components/StreamView";




interface Video {
    "id": string,
    "type": string,
    "url": string,
    "extractedId": string,
    "title": string,
    "smallImg": string,
    "bigImg": string,
    "active": boolean,
    "userId": string,
    "upvotes": number,
    "haveUpvoted": boolean
    // "downvotes": number;
}

const REFRESH_INTERVAL_MS = 10 * 1000;
const creatorId = "ec21db0a-39bb-4915-9a17-17275780f630"

export default function Commponent() {
    return <StreamView creatorId={creatorId} playVideo={true} />
}