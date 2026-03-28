import { useState, useEffect } from "react";
import { dbService } from "../services/db";
import type { Note } from "../types/note";
import { useTranslation } from "react-i18next";

export function useEditorStorage(id: string) {
  const { t } = useTranslation();
  const [data, setData] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await dbService.get(id);
        if (active) {
          setData((res as Note) || null);
          setIsLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(t("error.load_data_failed"));
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [id, t]);

  const save = async (note: Note) => {
    setIsLoading(true);
    try {
      await dbService.save(note);
    } catch (err) {
      setError(t("error.save_data_failed"));
      throw err;
    }
  };

  return { data, isLoading, error, save };
}
