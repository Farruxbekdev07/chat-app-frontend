"use client";
import { useNotification } from "src/hooks/useNotification";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import DashboardLayout from "src/layouts/DashboardLayout";
import { useOnlineStatusWriter } from "src/hooks/useUserStatus";

const DashboardPage = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  useNotification(currentUser?.uid);
  useOnlineStatusWriter();
  return <DashboardLayout />;
};

export default DashboardPage;
