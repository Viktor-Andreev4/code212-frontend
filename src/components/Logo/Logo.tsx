import "./Logo.css";

const Logo: React.FC = () => {
  return (
    <figure className="logo-wrapper">
      <h1 className="logo-heading">
        C<span>0</span>DE 212
      </h1>
      <div className="logo-line" />
    </figure>
  );
};

export default Logo;