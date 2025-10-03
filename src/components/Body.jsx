import"../styles/body.css"

function Body({children}){
    return(
        <div className="container-fluid container-body clearfix">
            {children}
        </div>
    );
}

export default Body;