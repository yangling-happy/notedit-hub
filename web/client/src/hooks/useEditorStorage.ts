import { useState, useEffect } from "react";
import { dbService } from "../services/db";
import type { Note } from "../types/note";

export function useEditorStorage(id: string) {
  const [data, setData] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. 初始化时加载数据
  useEffect(() => {
    let active = true; // 避免组件卸载后更新状态
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await dbService.get(id);
        if (active) {
          setData((res as Note) || null); // 没有数据时设为 null
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

  // 2. 保存数据的封装
  const save = async (note: Note) => {
    setIsLoading(true);
    try {
      await dbService.save(note);
      setData(note);
    } catch (err) {
      setError("保存数据失败");
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, save };
}
