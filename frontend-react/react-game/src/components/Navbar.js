export default function Navbar(){
    return <nav className="nav">
        <a href="/" className="site-title">Kviz Master</a>
        <ul>
            <CustomLink href="/kviz">Kviz</CustomLink>
            <CustomLink href="/login">Login</CustomLink>
            <CustomLink href="/about">O nama</CustomLink>         
        </ul>
    </nav>
}

function CustomLink ({ href, children, ...props}){
    const path = window.location.pathname
    if(path)
    return (
        <li className = {path === href ? "active" : ""}>
            <a href={href} {...props}>{children}</a>           
        </li>
    )
}