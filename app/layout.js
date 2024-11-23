import 'bootstrap/dist/css/bootstrap.min.css';
import localFont from 'next/font/local';
import './globals.css';
import { CustomSettingProvider } from './data/client-data';
import CustomSetting from './ui/custom-setting';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Custom Chatbot",
  description: "Custom Chatbot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CustomSettingProvider>
          <header>
            <CustomSetting />
          </header>
          {children}
        </CustomSettingProvider>
      </body>
    </html>
  );
}
