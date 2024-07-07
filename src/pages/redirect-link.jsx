import { getLongUrl } from "@/db/apiUrls";
import { storeClicks } from "@/db/apiClicks";
import useFetch from "@/hooks/use-fetch";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();
  const { loading, data, fn: fnGetLongUrl } = useFetch(getLongUrl, id);

  useEffect(() => {
    fnGetLongUrl();
  }, []);

  console.log(data);

  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [loading]);

  if (loading || loadingStats) {
    return <>
      <BarLoader width={"100%"} color="#36d7b7" />
      <br />
      Redirecting...
    </>;
  }

  return null;
};

export default RedirectLink;
