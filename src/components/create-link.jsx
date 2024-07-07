import { UrlState } from '@/context'
import React, { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import { Input } from './ui/input';
import Error from './error';
import { Card } from './ui/card';
import * as Yup from 'yup';
import { QRCode } from 'react-qrcode-logo';
import useFetch from '@/hooks/use-fetch';
import { createUrl } from '@/db/apiUrls';
import { BeatLoader } from 'react-spinners';


const CreateLink = () => {
    const { user } = UrlState();
    const ref = useRef();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const longLink = searchParams.get("createNew");

    const [errorState, setErrorState] = React.useState({});
    const [formValues, setFormValues] = React.useState({
        title: "",
        longUrl: longLink ? longLink : "",
        customUrl: "",
    });

    const schema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        longUrl: Yup.string().url("Must be a valid URL").required("Long URL is required"),
        customUrl: Yup.string(),
    });

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value,
        })
    }

    const {loading, error, data, fn: fnCreateUrl} = useFetch(createUrl,{...formValues, user_id: user?.id});

    useEffect(() => {
        if(error === null && data) {
            navigate(`/link/${data[0].id}`);
        }
    },[error,data])

    const createNewLink = async () => {
        setErrorState([]);
        try {
            await schema.validate(formValues, {abortEarly: false});
            const canvas = ref.current?.querySelector("canvas");
            const blob = await new Promise((resolve) => canvas.toBlob(resolve));

            await fnCreateUrl(blob);
        } catch (e) {
            const newErrors = {};
            e?.inner?.forEach((err) => {
                newErrors[err.path] = err.message;
            })
            setErrorState(newErrors);
        }
    }

    return (
        <Dialog defaultOpen={longLink}
        onOpenChange={(res) => {if(!res) setSearchParams({})}}
        >
            <DialogTrigger>
                <Button variant="destructive" >Create New Link</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
                </DialogHeader>
                {formValues?.longUrl && 
                <div ref={ref}>
                    <QRCode value={formValues?.longUrl} size={220}  />
                </div>
                }
                <Input 
                    id="title"
                    placeholder="Short Link's Title"
                    value={formValues.title}
                    onChange={handleChange}
                />
                {errorState.title && <Error message={error.title} />}
                <Input 
                    id="longUrl"
                    placeholder="Enter your long URL"
                    value={formValues.longUrl}
                    onChange={handleChange}
                />
                {errorState.longUrl && <Error message={error.longUrl} />}
                <div className='flex items-center gap-2'>
                    <Card className="p-2">trimmrr.netlify.app</Card>/
                    <Input 
                        id="customUrl"
                        placeholder="Custom Link (Optional)"
                        value={formValues.customUrl}
                        onChange={handleChange}
                    />
                </div>
                    {error && <Error message={error.message} />}
                <DialogFooter className={"sm:justify-start"}>
                    <Button onClick={createNewLink} variant="destructive" disabled={loading}>
                        {loading ? <BeatLoader size={10} color='white' /> : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateLink