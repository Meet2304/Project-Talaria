"use client";

import { useState } from "react";
import { SensorReading } from "@/types/sensor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SensorDataTableProps {
  data: SensorReading[];
  loading?: boolean;
  itemsPerPage?: number;
}

// Helper function to calculate average of array
const avg = (arr: number[]) => {
  if (!arr || arr.length === 0) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
};

export function SensorDataTable({ data, loading, itemsPerPage = 20 }: SensorDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading sensor data...</div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">No sensor data available</div>
        </CardContent>
      </Card>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Sensor Readings ({data.length} total readings, {data[0]?.n || 50} samples each)
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className=" border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-center">Avg Heart Rate</TableHead>
                <TableHead className="text-center">Avg IR</TableHead>
                <TableHead className="text-center">Avg Accel X</TableHead>
                <TableHead className="text-center">Avg Accel Y</TableHead>
                <TableHead className="text-center">Avg Accel Z</TableHead>
                <TableHead className="text-center">Avg Gyro X</TableHead>
                <TableHead className="text-center">Avg Gyro Y</TableHead>
                <TableHead className="text-center">Avg Gyro Z</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((reading, index) => {
                // Calculate averages from arrays
                const avgBpm = avg(reading.bpm || []);
                const avgIR = avg(reading.ir || []);
                const avgAx = avg(reading.ax || []);
                const avgAy = avg(reading.ay || []);
                const avgAz = avg(reading.az || []);
                const avgGx = avg(reading.gx || []);
                const avgGy = avg(reading.gy || []);
                const avgGz = avg(reading.gz || []);

                const globalIndex = startIndex + index + 1;

                return (
                  <TableRow key={reading.id || index}>
                    <TableCell className="font-medium">{globalIndex}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {new Date(reading.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={avgBpm > 0 ? "bg-red-50" : "bg-gray-50"}>
                        {avgBpm > 0 ? avgBpm.toFixed(0) : "0"} BPM
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-blue-50">
                        {avgIR.toFixed(0)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">
                      {avgAx.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">
                      {avgAy.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">
                      {avgAz.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">
                      {avgGx.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">
                      {avgGy.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs">
                      {avgGz.toFixed(3)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination controls at bottom */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} readings
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

