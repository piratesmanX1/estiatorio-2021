import '../assets/css/default.css';

const TestView = ({data}) => {
    console.log(data);
    return (
        <div className="TestView">
            {
            data.map((obj) => (
                    <div className="content-block" key={obj.id}>
                        <p>{obj.texthere}</p>
                        <p>{obj.descr}</p>
                    </div>
                ))
            }
        </div>
    );
}
 
export default TestView;