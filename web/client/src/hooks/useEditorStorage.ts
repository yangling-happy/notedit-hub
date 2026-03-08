import { useState, useEffect } from "react";
import { dbService } from "../services/db";
import type { Note } from "../types/note";

export function useEditorStorage(id: string) {
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
          setError("加载数据失败");
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [id]);

  const save = async (note: Note) => {
    setIsLoading(true);
    try {
      await dbService.save(note);
    } catch (err) {
      setError("保存数据失败");
      throw err;
    }
  };

  return { data, isLoading, error, save };
}
