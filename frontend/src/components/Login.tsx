import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/useUser";

type Props = {
    handleToggleRegister: () => void
}

type FormValues = {
    username: string;
    password: string;
};

export default function Login({ handleToggleRegister }: Props) {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const { setUser } = useUser()

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {

        const { data: axiosData } = await axios.post("http://localhost:1337/api/v1/auth/login", data, {
            withCredentials: true
        })

        if (axiosData.success === true) {
            setUser(axiosData.user)
            navigate("/")
        }
    };
    return (
        <div className="py-4 px-6 font-poppins  h-full flex flex-col justify-center">
            <h1 className="text-2xl lg:text-4xl font-semibold">Login</h1>
            <h3 className="text-sm lg:text-lg font-medium mt-2">Login to enjoy messaging to your friends and family</h3>
            {/* input boxes */}
            <form className="grid grid-cols-2 gap-3 lg:gap-4 mt-5" onSubmit={handleSubmit(onSubmit)}>
                <Input {...register("username")} placeholder="Username" className="col-span-2" required />
                {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}

                <Input {...register("password")} placeholder="Password" type="password" className="col-span-2" required />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                <Button className="col-span-2 mt-1">Register Now</Button>
                <div className="text-[15px] font-medium text-center flex items-center justify-center w-full col-span-2">Don&apos;t have an account? &nbsp; <span className="underline cursor-pointer font-semibold" onClick={handleToggleRegister}>Register</span></div>
            </form>
        </div>
    )
}
