import { NextPage } from "next";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

const UserProfilePage: NextPage = () => {
    return (
        <div>
            <TwitterLayout>
                <div>
                    <nav><ArrowLeft size={28} /></nav>
                </div>
            </TwitterLayout>
        </div>
    )
}

export default UserProfilePage;