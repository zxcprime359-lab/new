import { useQuery } from "@tanstack/react-query";

export function useOpenSubtitleVtt(downloadLink: string | null) {
  return useQuery({
    queryKey: ["opensubtitle-vtt", downloadLink],
    enabled: !!downloadLink,
    staleTime: 0,
    retry: 2,
    queryFn: async () => {
      console.log("QUERY RUNNING with:", downloadLink);

      const res = await fetch(downloadLink!);

      // This URL directly serves the SRT file, not JSON
      const srtText = await res.text();
      console.log("SRT content preview:", srtText.slice(0, 200));

      const vttText =
        "WEBVTT\n\n" +
        srtText.replace(/\r\n/g, "\n").replace(/(\d+:\d+:\d+),(\d+)/g, "$1.$2");

      const blob = new Blob([vttText], { type: "text/vtt" });
      return URL.createObjectURL(blob);
    },
  });
}
