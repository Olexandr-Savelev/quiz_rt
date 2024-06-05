"use client";

import React, { useEffect } from "react";

const Page = ({ params }: { params: { teamId: string } }) => {
  useEffect(() => {}, [params]);
  return <div>page</div>;
};

export default Page;
