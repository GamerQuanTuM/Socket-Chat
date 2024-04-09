export default function Archive({ color = "currentColor" }: { color?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={color} viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M208,216H48a8,8,0,0,1-8-8V72L56,40H200l16,32V208A8,8,0,0,1,208,216Z" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><polyline points="94.1 150.1 128 184 161.9 150.1" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="128" y1="104" x2="128" y2="184" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="40" y1="72" x2="216" y2="72" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
    )
}
