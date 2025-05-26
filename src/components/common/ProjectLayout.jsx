import ProjectDetails from "../ProjectDetail";

const ProjectPageLayout = () => (
  <>
    <ProjectDetails />
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          © 2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Twahanur™
          </a>
          . All Rights Reserved.
        </span>
      </center>
    </footer>
  </>
);
export default ProjectPageLayout;