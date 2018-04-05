using System;

namespace TSDMMusicdotNet.Helpers
{
    public class MusicHelper
    {
        public static Tuple<bool, string, string> GetMediaTypeAndResulotion(int mediaFormatNo, string bitPerSample, int samplingFreq, int mediaType)
        {
            Tuple<bool, string, string> result = new Tuple<bool, string, string>(false, "AAC", "320Kbps");
            decimal khz = samplingFreq / 1000;
            decimal mhz = samplingFreq / 1000000;
            if (mediaFormatNo == 12)
            {
                result = new Tuple<bool, string, string>(true, "FLAC", khz.ToString() + "kHz/" + bitPerSample + "bit");
            }
            else if (mediaFormatNo == 10)
            {
                result = new Tuple<bool, string, string>(false, "AAC", "320Kbps");
            }
            else if (mediaFormatNo == 13)
            {
                if (mediaType == 9)
                {
                    result = new Tuple<bool, string, string>(true, "DSD(DSF)", khz.ToString() + "MHz/" + bitPerSample + "bit");
                }
                else if (mediaType == 10)
                {
                    result = new Tuple<bool, string, string>(true, "DSD(DFF)", khz.ToString() + "MHz/" + bitPerSample + "bit");
                }
            }
            return result;
        }

        private static string SecondToTime(int inputsecond)
        {
            int s = inputsecond % 60;
            int min = inputsecond / 60;
            if (min > 60)
            {
                int hr = min / 60;
                min = min % 60;
                return hr + ":" + min + ":" + s;
            }
            else
            {
                return min + ":" + s;
            }
        }

        public static string GetAlbumLength(int AlbumSec) => SecondToTime(AlbumSec);

        public static string GetTrackLength(int TrackSec) => SecondToTime(TrackSec);
    }
}