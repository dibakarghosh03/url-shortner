import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BeatLoader } from 'react-spinners'
import Error from './error'
import * as Yup from 'yup'
import useFetch from '@/hooks/use-fetch'
import { signup } from '@/db/apiAuth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UrlState } from '@/context'

const Signup = () => {

    const [errors, setErrors] = useState([])
    const navigate = useNavigate()
    let [searchParams] = useSearchParams()
    
    const longLink = searchParams.get('createNew')
    const [formData, setFormData] = useState({
        name:'',
        email: '',
        password: '',
        profile_pic: null,
    });

    const handleInputChange = (e) => {
        const {name, value, files} = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: files ? files[0] : value,
        }))
    }

    const { data, error, loading, fn: fnSignup } = useFetch(signup, formData)
    const { fetchUser } = UrlState()

    useEffect(() => {
        console.log(data)
        console.log(error)
        if(error === null && data) {
            navigate(`/dashboard`)
            fetchUser()
        }
    },[data, error])

    const handleSignup = async () => {
        setErrors([])
        try {
            const schema = Yup.object().shape({
                name: Yup.string()
                        .required("Name is required"),
                email: Yup.string()
                        .email("Invalid email")
                        .required("Email is required"),
                password: Yup.string()
                        .min(6, "Password must be at least 6 characters")
                        .required("Password is required"),
                profile_pic: Yup.mixed().required("Profile picture is required"),
            })

            await schema.validate(formData, {abortEarly: false})

            await fnSignup()
        } catch (e) {
            const newErrors = {};

            e?.inner?.forEach((err) => {
                newErrors[err.path] = err.message;
            })

            setErrors(newErrors)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Signup</CardTitle>
                <CardDescription>
                    Create a new account
                </CardDescription>
                {error && <Error message={error.message} />}
            </CardHeader>
            <CardContent className="space-y-2">
                <div className='space-y-1'>
                    <Input 
                        type="text" 
                        name="name"
                        placeholder="Enter your name" 
                        onChange={handleInputChange}
                    />
                    {errors.name && <Error message={errors.name} />}
                </div>
                <div className='space-y-1'>
                    <Input 
                        type="email" 
                        name="email"
                        placeholder="Enter your email" 
                        onChange={handleInputChange}
                    />
                    {errors.email && <Error message={errors.email} />}
                </div>
                <div>
                    <Input 
                        type="password" 
                        name="password"
                        placeholder="Enter your password"
                        onChange={handleInputChange}
                    />
                    {errors.password && <Error message={errors.password} />}
                </div>
                <div className='space-y-1'>
                    <Input 
                        type="file" 
                        name="profile_pic"
                        accept="image/*"
                        onChange={handleInputChange}
                    />
                    {errors.profile_pic && <Error message={errors.profile_pic} />}
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSignup} >
                    {loading ?  <BeatLoader size={10} color='#36d7b7' /> : "Create Account"}
                </Button>
            </CardFooter>
        </Card>

    )
}

export default Signup