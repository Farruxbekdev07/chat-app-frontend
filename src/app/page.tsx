"use client";

import { useEffect } from "react";
import { RootState } from "src/redux/store";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import Loader from "src/components/Loader";
import { setLoading } from "src/redux/authSlice";
import DashboardLayout from "src/layouts/DashboardLayout";
import { useUsersWithLastMessage } from "src/hooks/users";
import { useNotification } from "src/hooks/useNotification";
import { useOnlineStatusWriter } from "src/hooks/useUserStatus";

const DashboardPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const { loading: usersLoading } = useUsersWithLastMessage();

  useNotification(currentUser?.uid || "");
  useOnlineStatusWriter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (usersLoading) {
      dispatch(setLoading(true));
      return;
    }

    dispatch(setLoading(false));
  }, [currentUser, usersLoading, dispatch, router]);

  if (usersLoading) return <Loader />;

  return <DashboardLayout />;
};

export default DashboardPage;
