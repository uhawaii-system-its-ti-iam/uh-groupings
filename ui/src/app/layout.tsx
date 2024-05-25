import './globals.css';
import { Source_Sans_3 } from 'next/font/google';
import Navbar from './_components/navbar/navbar';
import Footer from './_components/footer/footer';
import type { Metadata } from 'next';

const sourceSans3 = Source_Sans_3({
    subsets: ['latin'],
    weight: ['400', '600', '700', '900'],
    style: ['normal', 'italic'],
    variable: '--font-source-sans-3'
});

export const metadata: Metadata = {
    title: 'UH Groupings'
};

const RootLayout = ({
    children,
}: Readonly<{
    children?: React.ReactNode;
}>) => (
    <html lang="en">
        <body className={sourceSans3.variable}>
            <Navbar />
            {children}
            <Footer />
        </body>
    </html>
);

export default RootLayout;
