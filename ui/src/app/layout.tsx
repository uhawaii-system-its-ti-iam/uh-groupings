import './globals.css';
import { Source_Sans_3 } from 'next/font/google';
import Navbar from '@/components/layout/navbar/navbar';
import Footer from '@/components/layout/footer';
import type { Metadata } from 'next';
import { BlockNavigationProvider } from '@/components/hook/useBlockNavigation';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

const sourceSans3 = Source_Sans_3({
    subsets: ['latin'],
    weight: ['400', '600', '700', '900'],
    style: ['normal', 'italic'],
    variable: '--font-source-sans-3',
});

export const metadata: Metadata = {
    title: 'UH Groupings',
};

const RootLayout = ({
    children,
    error,
    }: Readonly<{
    children?: React.ReactNode;
    error?: React.ReactNode;
}>) => (
    <html lang="en">
    <body className={`${sourceSans3.variable} min-h-screen flex flex-col`}>
    <BlockNavigationProvider>
        <Navbar />
        <main className="flex-grow">{children}</main>
        {error}
        <Footer />
    </BlockNavigationProvider>
    </body>
    </html>
);

export default RootLayout;
