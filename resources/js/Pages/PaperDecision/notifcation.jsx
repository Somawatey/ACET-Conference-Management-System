//send notification to author after make final decision
const Notification = ({ paper }) => {
    // Logic to send notification
    return (
        <div>
            Notification sent to {paper.author} about the decision on {paper.title}.
        </div>
    );
};
