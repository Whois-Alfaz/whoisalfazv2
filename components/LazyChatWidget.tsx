'use client';

import dynamic from 'next/dynamic';

const GlobalChatWidget = dynamic(() => import('./GlobalChatWidget'), {
    ssr: false,
});

export default function LazyChatWidget() {
    return <GlobalChatWidget />;
}
