import { memo } from "react";
import PropTypes from "prop-types";
const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>
));

TechStack.propTypes = {
    tech: PropTypes.string,
}
TechStack.displayName = "TechStack";
export default TechStack;