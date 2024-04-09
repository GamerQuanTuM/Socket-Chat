import { Upload, X } from "lucide-react"
import { useState } from "react"
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import axios from "axios";

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "./ui/button"
import { CheckedState } from "@radix-ui/react-checkbox";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

type Props = {
    handleToggleRegister: () => void
}

type FormValues = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    bio: string;
    password: string;
    confirmPassword: string;
    file: File;
};


export default function Register({ handleToggleRegister }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate()
    const [privacyPolicy, setPrivacyPolicy] = useState<CheckedState>(false)
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const { setUser } = useUser()

    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0]
        if (file) {
            setFile(file)
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (privacyPolicy && data.password === data.confirmPassword) {

            const formData = new FormData();
            formData.append("avatar", data.file);
            formData.append("name", data.firstName + " " + data.lastName);
            formData.append("email", data.email);
            formData.append("username", data.username);
            formData.append("bio", data.bio);
            formData.append("password", data.password);
            formData.append("avatar", file as any);

            const config = {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            const { data: axiosData } = await axios.post("http://localhost:1337/api/v1/auth/register", formData, config)

            if (axiosData.success === true) {
                setUser(axiosData.user)
                navigate("/")
            }

        }
    };


    return (
        <div className="flex flex-col justify-center h-full w-full font-poppins px-4 lg:px-6">
            <h1 className="text-2xl lg:text-4xl font-semibold">Register</h1>
            <h3 className="text-sm lg:text-lg font-medium mt-2">Create an account. Its free and it takes only a minute</h3>
            {/* input boxes */}
            <form className="grid grid-cols-2 gap-3 lg:gap-4 mt-5" onSubmit={handleSubmit(onSubmit)}>
                <Input placeholder="First Name" {...register("firstName")} className="col-span-1" required />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}

                <Input placeholder="Last Name" {...register("lastName")} className="col-span-1" required />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}

                <Input placeholder="Username" {...register("username")} className="col-span-2 lg:col-span-1" required />
                {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}

                <Input placeholder="Email" {...register("email")} className="col-span-2 lg:col-span-1" required />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

                <Input placeholder="Bio" {...register("bio")} className="col-span-2" />
                {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}

                <Input placeholder="Password" {...register("password")} type="password" className="col-span-2" required />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

                <Input placeholder="Confirm Password" {...register("confirmPassword")} type="password" className="col-span-2" required />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}

                <Input type="file" {...register("file")} id="avatarInput" onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />

                {errors.file && <p className="text-sm text-red-500">{errors.file.message}</p>}

                <div className="w-full h-10 lg:h-24 border-dotted border-2 border-slate-300 bg-white col-span-2 flex justify-center items-center flex-col gap-2">
                    {file ?
                        <div className="relative w-full">
                            <div className="absolute right-2 top-0 lg:-top-5 cursor-pointer" onClick={() => setFile(null)}>
                                <X />
                            </div>
                            <h1 className="text-center">{file.name}</h1>
                        </div>
                        :
                        <div onClick={() => document.getElementById('avatarInput')!.click()} className="cursor-pointer h-full w-full flex flex-col gap-2 justify-center items-center ">
                            <Upload color="grey" className="hidden lg:block" />
                            <h5 className="text-gray-600">Upload an Avatar</h5>
                        </div>}
                </div>

                <div className="flex items-center space-x-4 lg:space-x-2 col-span-2">
                    <Checkbox id="terms" className="w-4 h-4" onCheckedChange={(e: CheckedState) => setPrivacyPolicy(e)} />
                    <label
                        htmlFor="terms"
                        className="text-[15px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        I accept the Terms of Use and Privacy Policy
                    </label>
                </div>
                <Button disabled={privacyPolicy === false} className="col-span-2 mt-1 disabled:cursor-not-allowed">Register Now</Button>
                <div className="text-[15px] font-medium text-center flex items-center justify-center w-full col-span-2">Already signed in? &nbsp; <span className="underline cursor-pointer font-semibold" onClick={handleToggleRegister}>Login</span></div>
            </form>
        </div>
    )
}
