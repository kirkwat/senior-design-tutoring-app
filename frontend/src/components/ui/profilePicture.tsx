interface ProfilePicInput {
    imageUrl: string;
    size: number;
}
  
const ProfilePic: React.FC<ProfilePicInput> = ({ imageUrl, size }) => {
    return (
        <div className={`w-${size} h-${size} rounded-full overflow-hidden`} style={{ width: `${size}px`, height: `${size}px` }}>
          <img src={imageUrl} alt="Profile Pic" />
        </div>
      );
};

export {ProfilePic}