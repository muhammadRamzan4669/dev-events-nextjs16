export interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  image: string;
  description?: string;
}

export const events: Event[] = [
  {
    id: "1",
    title: "GitHub Universe 2025",
    location: "San Francisco, CA",
    date: "28th October 2025",
    time: "12:25pm - 2:40pm",
    image: "/images/event1.png",
    description: "The ultimate developer conference featuring the latest in AI-powered development tools and open source innovations."
  },
  {
    id: "2",
    title: "React Summit 2025",
    location: "Amsterdam, Netherlands",
    date: "15th March 2025",
    time: "9:00am - 6:00pm",
    image: "/images/event2.png",
    description: "Join the global React community for cutting-edge talks, workshops, and networking opportunities."
  },
  {
    id: "3",
    title: "DockerCon Developer Conference",
    location: "Seattle, WA",
    date: "22nd April 2025",
    time: "10:30am - 5:15pm",
    image: "/images/event3.png",
    description: "Explore the future of containerization, DevOps, and cloud-native development with industry experts."
  },
  {
    id: "4",
    title: "AWS re:Invent 2025",
    location: "Las Vegas, NV",
    date: "3rd November 2025",
    time: "8:00am - 7:30pm",
    image: "/images/event4.png",
    description: "The premier cloud computing event featuring new AWS services, best practices, and hands-on learning."
  },
  {
    id: "5",
    title: "PyCon US 2025",
    location: "Pittsburgh, PA",
    date: "14th May 2025",
    time: "9:15am - 6:45pm",
    image: "/images/event5.png",
    description: "The largest annual gathering for the community using and developing Python programming language."
  },
  {
    id: "6",
    title: "Node.js Interactive",
    location: "Vancouver, BC",
    date: "18th September 2025",
    time: "11:00am - 4:20pm",
    image: "/images/event6.png",
    description: "Dive deep into Node.js ecosystem with talks on performance, security, and emerging technologies."
  },
  {
    id: "7",
    title: "KubeCon + CloudNativeCon",
    location: "Paris, France",
    date: "7th July 2025",
    time: "8:45am - 6:10pm",
    image: "/images/event7.png",
    description: "The flagship conference for cloud native computing, featuring Kubernetes and CNCF projects."
  },
  {
    id: "8",
    title: "DevOps World 2025",
    location: "London, UK",
    date: "25th June 2025",
    time: "10:15am - 5:30pm",
    image: "/images/event8.png",
    description: "Leading DevOps event bringing together practitioners to share knowledge and best practices."
  },
  {
    id: "9",
    title: "Google I/O Extended",
    location: "Mountain View, CA",
    date: "12th August 2025",
    time: "1:00pm - 8:15pm",
    image: "/images/event9.png",
    description: "Experience the latest Google technologies, Android development, and AI innovations firsthand."
  }
];

// Helper function to get event by ID
export const getEventById = (id: string): Event | undefined => {
  return events.find(event => event.id === id);
};

// Helper function to get featured events (first 3)
export const getFeaturedEvents = (): Event[] => {
  return events.slice(0, 3);
};