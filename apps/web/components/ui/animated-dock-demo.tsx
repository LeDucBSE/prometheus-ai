import { Flower, Github, Twitter, Youtube } from "lucide-react";
import { AnimatedDock } from "@/components/ui/animated-dock";

const Demo = () => {
  return (
    <AnimatedDock
      items={[
        {
          id: "github-profile",
          link: "https://github.com/preetsuthar17",
          target: "_blank",
          label: "GitHub",
          Icon: <Github size={22} />,
        },
        {
          id: "twitter-profile",
          link: "https://x.com/preetsuthar17",
          target: "_blank",
          label: "Twitter",
          Icon: <Twitter size={22} />,
        },
        {
          id: "youtube-channel",
          link: "https://www.youtube.com/@preetsuthar17",
          target: "_blank",
          label: "YouTube",
          Icon: <Youtube size={22} />,
        },
        {
          id: "project-link",
          link: "https://github.com/preetsuthar17/hextaui",
          target: "_blank",
          label: "Project",
          Icon: <Flower size={22} />,
        },
      ]}
    />
  );
};

export { Demo };
