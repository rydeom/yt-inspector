import './ChannelInfoDisplay.scss';

function getJoinedDate(date: string) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const day = dateObj.getDate();
    return `${day}.${month}.${year}`;
}

function getNumberWithPoint(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function dataItems(label: string, value: string) {
    return (
        <div className="data-item">
            <h3>{label}</h3>
            <p>{value}</p>
        </div>
    );
}

function getAvatar(avatar: any) {
    if (avatar) {
        return avatar[1].url;
    }
    return '';
}

export const ChannelInfoDisplay = (props: any) => {
    return (
        <div className="channel-info">
            <div className="header">
                <div className="title">
                    <h2>Youtube Channel:</h2>
                    <p>{props.name}</p>
                </div>
                <div className="avatar">
                    <img src={getAvatar(props.avatar)} alt="avatar" />
                </div>
            </div>
            <hr />
            <div className="content">
                <div className="data">
                    { dataItems('Subscribers', getNumberWithPoint(props.stats.subscribers)) }
                    { dataItems('Views', getNumberWithPoint(props.stats.views)) }
                    { dataItems('Joined', getJoinedDate(props.joinedDate)) }
                </div>
                <div className="description">
                    <p>{props.description}</p>
                </div>
            </div>
        </div>
    )
}