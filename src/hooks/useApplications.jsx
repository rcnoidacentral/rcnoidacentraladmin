import { useState, useEffect } from "react";
import { PROGRAM_ORDER, PROGRAM_NAME_MAP } from "../constants/programConstants";
import adminApiService from "../api/adminApi.service";
import { toast } from "react-hot-toast";

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      const res = await adminApiService.getAllApplications();
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications");
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // let mounted = true;


    fetchApplications();

    // Optional polling every 30s
    const interval = setInterval(fetchApplications, 30000);

    return () => {
      // mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { applications, loading, error,    refetch: fetchApplications };
};

export const useApplicationFilters = (applications) => {
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredApps, setFilteredApps] = useState([]);

  useEffect(() => {
    let data = [...applications];

    if (search.trim()) {
      data = data.filter((app) =>
        Object.values(app).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (program) {
      data = data.filter((app) => app.program === program);
    }

    if (statusFilter !== "all") {
      data = data.filter(
        (app) => (app.status || "submitted") === statusFilter
      );
    }

    data.sort((a, b) => {
      const indexA = PROGRAM_ORDER.indexOf(
        PROGRAM_NAME_MAP[a.program] || a.program
      );
      const indexB = PROGRAM_ORDER.indexOf(
        PROGRAM_NAME_MAP[b.program] || b.program
      );

      if (indexA !== indexB) return indexA - indexB;

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredApps(data);
  }, [applications, search, program, statusFilter]);

  return {
    filteredApps,
    search,
    setSearch,
    program,
    setProgram,
    statusFilter,
    setStatusFilter,
  };
};
