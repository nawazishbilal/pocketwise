import './card.css'

export default function DashboardCard(props) {
    const transValue = props.num;
    const transType = props.type;
    const color = props.color;

    return (
        <>
            <div className='card'>
                <p id='card-title'>{transType}</p>
                <p id='card-value' style={{color:color}}>${transValue}</p>
            </div>
        </>
    )
}