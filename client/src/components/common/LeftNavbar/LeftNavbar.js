import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  UserGroupIcon,
  CalendarIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  InboxIcon,
  PowerIcon,
  ChatBubbleOvalLeftIcon,
  BellIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectUserType } from "../../../redux/store/authSlice";

export function SidebarWithContentSeparator() {
  const [open, setOpen] = React.useState(0);
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(false);
  const navigate = useNavigate();
  const userType = useSelector(selectUserType);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isExpanded) {
      setIsExpanded(false);
    }
    setIsSidebarVisible(false);
  };

  const toggleSidebarVisibility = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      <button
        className="fixed top-4 left-4 md:hidden z-50"
        onClick={toggleSidebarVisibility}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      <motion.div
        animate={{ width: isExpanded ? 320 : 110 }}
        className={`fixed inset-y-0 left-0 z-40 md:relative md:translate-x-0 md:flex p-4 shadow-blue-gray-900/5 transition-transform duration-300 ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Card className="h-full w-full p-4">
          <div className="mb-2 p-4 flex justify-between items-center">
            {isExpanded && (
              <Typography variant="h5" color="blue-gray">
                Alumni Portal
              </Typography>
            )}
            <button onClick={toggleSidebar}>
              {isExpanded ? (
                <ChevronLeftIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <List>
            <ListItem onClick={() => handleNavigation(`/profile/:userId`)}>
              <ListItemPrefix>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              {isExpanded && "Profile"}
            </ListItem>
            <ListItem onClick={() => handleNavigation(`/user-directory`)}>
              <ListItemPrefix>
                <UserGroupIcon className="h-5 w-5" />
              </ListItemPrefix>
              {isExpanded && "User Directory"}
            </ListItem>
            <Accordion
              open={open === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 1 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={open === 1}>
                <AccordionHeader
                  onClick={() => handleOpen(1)}
                  className="border-b-0 p-3"
                >
                  <ListItemPrefix>
                    <CalendarIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  {isExpanded && (
                    <Typography
                      color="blue-gray"
                      className="mr-auto font-normal"
                    >
                      Events
                    </Typography>
                  )}
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  {userType === "admin" && (
                    <ListItem onClick={() => handleNavigation(`/events`)}>
                      <ListItemPrefix>
                        <ChevronRightIcon
                          strokeWidth={3}
                          className="h-3 w-5"
                        />
                      </ListItemPrefix>
                      {isExpanded && "Manage Events"}
                    </ListItem>
                  )}
                  <ListItem
                    onClick={() => handleNavigation(`/events/upcoming`)}
                  >
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    {isExpanded && "Upcoming Events"}
                  </ListItem>
                  <ListItem onClick={() => handleNavigation(`/events/past`)}>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    {isExpanded && "Past Events"}
                  </ListItem>
                  <ListItem onClick={() => handleNavigation(`/gallery`)}>
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    {isExpanded && "Event Gallery"}
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion>
            <ListItem onClick={() => handleNavigation(`/jobs`)}>
              <ListItemPrefix>
                <BriefcaseIcon className="h-5 w-5" />
              </ListItemPrefix>
              {isExpanded && "Job Postings"}
            </ListItem>
            {userType === "admin" && (
              <ListItem onClick={() => handleNavigation(`/donation-analytics`)}>
                <ListItemPrefix>
                  <CurrencyDollarIcon className="h-5 w-5" />
                </ListItemPrefix>
                {isExpanded && "Donations Analytics"}
              </ListItem>
            )}
            {userType !== "admin" && (
              <ListItem onClick={() => handleNavigation(`/make-donation`)}>
                <ListItemPrefix>
                  <CurrencyDollarIcon className="h-5 w-5" />
                </ListItemPrefix>
                {isExpanded && "Donations"}
              </ListItem>
            )}
            <ListItem onClick={() => handleNavigation(`/forum`)}>
              <ListItemPrefix>
                <ChatBubbleOvalLeftIcon className="h-5 w-5" />
              </ListItemPrefix>
              {isExpanded && "Forum"}
            </ListItem>
            <hr className="my-2 border-blue-gray-50" />
            <ListItem onClick={() => handleNavigation(`/messages`)}>
              <ListItemPrefix>
                <InboxIcon className="h-5 w-5" />
              </ListItemPrefix>
              {isExpanded && "Messages"}
              {isExpanded && (
                <ListItemSuffix>
                  <Chip
                    value="New"
                    size="sm"
                    variant="ghost"
                    color="blue-gray"
                    className="rounded-full"
                  />
                </ListItemSuffix>
              )}
            </ListItem>
            <ListItem onClick={() => handleNavigation(`/notifications`)}>
              <ListItemPrefix>
                <BellIcon className="h-5 w-5" />
              </ListItemPrefix>
              {isExpanded && "Notifications"}
            </ListItem>
            {userType === "admin" && (
              <>
                <ListItem onClick={() => handleNavigation(`/upload-students`)}>
                  <ListItemPrefix>
                    <Cog6ToothIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  {isExpanded && "Upload CSV"}
                </ListItem>
                <ListItem onClick={() => handleNavigation(`/preuser`)}>
                  <ListItemPrefix>
                    <Cog6ToothIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  {isExpanded && "Manage User"}
                </ListItem>
              </>
            )}
            <ListItem onClick={() => handleNavigation(`/logout`)}>
              <ListItemPrefix>
                <PowerIcon className="h-5 w-5" />
              </ListItemPrefix>
              {isExpanded && "Log Out"}
            </ListItem>
          </List>
        </Card>
      </motion.div>
    </>
  );
}
