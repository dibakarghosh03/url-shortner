import DeviceStats from '@/components/device-stats';
import Location from '@/components/location-stats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UrlState } from '@/context';
import { getClicksForUrl } from '@/db/apiClicks';
import { deleteUrl, getUrl } from '@/db/apiUrls';
import useFetch from '@/hooks/use-fetch';
import { Copy, Download, LinkIcon, Trash } from 'lucide-react';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { BarLoader, BeatLoader } from 'react-spinners';

const Link = () => {
  const { id } = useParams();
  const {user} = UrlState();
  const navigate = useNavigate();

  const {loading, data: url, error, fn: fnGetUrl} = useFetch(getUrl, {id, user_id: user?.id});
  const {loading: loadingStats, data: stats, fn: fnStats} = useFetch(getClicksForUrl, id);
  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl,id);

  useEffect(() => {
    fnGetUrl();
    fnStats();
  },[]);

  if(error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url?.short_url;
  }

  const downloadImage = async () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement('a');
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);

    anchor.click();
    document.body.removeChild(anchor);
  }


  return <>
    {(loading || loadingStats) && (
      <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
    )}
    <div className='flex flex-col mx-auto max-w-screen lg:flex-row gap-16 justify-between'>
      <div className='flex flex-col items-start gap-8 rounded-lg w-fit lg:w-2/5'>
        <span className='text-5xl sm:text-6xl font-extrabold hover:underline cursor-pointer'>
          {url?.title}
        </span>
        <a 
          href={`https://trimmrr.netlify.app/${link}`} 
          target='_blank'
          className='text-2xl sm:text-4xl lg:2xl xl:text-4xl text-blue-400 font-bold hover:underline cursor-pointer'
        >
          https://trimmrr.netlify.app/{link}
        </a>
        <a 
          href={`${url?.original_url}`} 
          target='_blank'
          className='flex items-center text-sm sm:text-base gap-1 hover:underline cursor-pointer'
        >
          <LinkIcon className='p-1' />
          {url?.original_url}
        </a>
        <span className='flex items-end font-extralight text-sm'>
          {new Date(url?.created_at).toLocaleString()}
        </span>
        <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                navigator.clipboard.writeText(`https://trimmrr.netlify.app/${link}`)
              }
            >
              <Copy />
            </Button>
            <Button variant="ghost" onClick={downloadImage}>
              <Download />
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                fnDelete().then(() => {
                  navigate("/dashboard");
                })
              }
              disable={loadingDelete}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <Trash />
              )}
            </Button>
          </div>
          <img
            src={url?.qr}
            alt='qr code'
            className='w-11/12 sm:w-2/5 lg:w-3/5 self-center sm:self-start ring ring-blue-500 p-1 object-contain'
          />
      </div>
      <Card className="sm:w-3/5">
        <CardHeader >
          <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
        </CardHeader>
        {stats && stats?.length ? (
          <CardContent className="fle-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{stats?.length}</p>
              </CardContent>
            </Card>
            <CardTitle className="my-8">Loaction Data</CardTitle>
            <Location stats={stats} />
            <CardTitle className="my-8">Device Info</CardTitle>
            <DeviceStats stats={stats} />
          </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false 
              ? "No Statistics Yet" 
              : "Loading Statistics..."}
            </CardContent>
          )}
      </Card>
    </div>
    </>
  
}

export default Link