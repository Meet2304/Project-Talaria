"use client";

import { useState, Fragment } from "react";
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
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

interface SensorDataDetailedTableProps {
  data: SensorReading[];
  loading?: boolean;
  itemsPerPage?: number;
}

export function SensorDataDetailedTable({ data, loading, itemsPerPage = 10 }: SensorDataDetailedTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReadings, setExpandedReadings] = useState<Set<string>>(new Set());
  const [expandAll, setExpandAll] = useState(false);

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

  const toggleReading = (id: string) => {
    setExpandedReadings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleExpandAll = () => {
    if (expandAll) {
      setExpandedReadings(new Set());
    } else {
      const allIds = new Set(currentData.map(r => r.id));
      setExpandedReadings(allIds);
    }
    setExpandAll(!expandAll);
  };

  // Calculate total samples across all readings
  const totalSamples = data.reduce((sum, reading) => sum + (reading.n || 50), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Detailed Sensor Readings ({data.length} readings, {totalSamples.toLocaleString()} total samples)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleExpandAll}
            >
              {expandAll ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Collapse All
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Expand All
                </>
              )}
            </Button>
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Expand</TableHead>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-center">Samples</TableHead>
                <TableHead className="text-center">Steps</TableHead>
                <TableHead className="text-center">HR</TableHead>
                <TableHead className="text-center">SpO2</TableHead>
                <TableHead className="text-center">Temp (°C)</TableHead>
                <TableHead className="text-center">Accel X/Y/Z</TableHead>
                <TableHead className="text-center">Gyro X/Y/Z</TableHead>
                <TableHead className="text-center">Pitch</TableHead>
                <TableHead className="text-center">Roll</TableHead>
                <TableHead className="text-center">Yaw</TableHead>
                <TableHead className="text-center">IR/Red</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((reading, readingIndex) => {
                const globalIndex = startIndex + readingIndex + 1;
                const isExpanded = expandedReadings.has(reading.id);
                const sampleCount = reading.n || 17;

                // Get data arrays with fallbacks for backward compatibility
                const accX = reading.accX || reading.ax || [];
                const accY = reading.accY || reading.ay || [];
                const accZ = reading.accZ || reading.az || [];
                const gyroX = reading.gyroX || reading.gx || [];
                const gyroY = reading.gyroY || reading.gy || [];
                const gyroZ = reading.gyroZ || reading.gz || [];
                const hr = reading.hr || reading.bpm || [];
                const spo2 = reading.spo2 || [];
                const temp = reading.temp_c || [];
                const ir = reading.ir || [];
                const red = reading.red || [];
                const combpitch = reading.combpitch || reading.apitch || [];
                const combroll = reading.combroll || reading.aroll || [];
                const gyaw = reading.gyaw || [];

                return (
                  <Fragment key={reading.id}>
                    {/* Summary Row */}
                    <TableRow className="bg-muted/50 font-medium hover:bg-muted/70">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReading(reading.id)}
                          className="h-6 w-6 p-0"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>{globalIndex}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {new Date(reading.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{sampleCount} samples</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {reading.steps_in_batch !== undefined && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {reading.steps_in_batch} steps
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell colSpan={9} className="text-center text-muted-foreground text-xs">
                        Click expand to see all {sampleCount} samples with detailed sensor data
                      </TableCell>
                    </TableRow>

                    {/* Expanded Detail Rows - Show all samples */}
                    {isExpanded && accX.length > 0 && (
                      <>
                        {Array.from({ length: sampleCount }).map((_, sampleIndex) => (
                          <TableRow key={`${reading.id}-${sampleIndex}`} className="text-xs">
                            <TableCell></TableCell>
                            <TableCell className="text-muted-foreground"></TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                              {sampleIndex === 0 && `+${reading.client_ts_ms}ms`}
                            </TableCell>
                            <TableCell className="text-center font-mono">
                              {sampleIndex + 1}
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground text-xs">
                              {sampleIndex === 0 && reading.steps_in_batch !== undefined && `${reading.steps_in_batch}`}
                            </TableCell>
                            {/* Heart Rate */}
                            <TableCell className="text-center">
                              {hr[sampleIndex] !== undefined && (
                                <Badge 
                                  variant="outline" 
                                  className={hr[sampleIndex] > 0 ? "bg-red-50 text-red-700" : "bg-gray-50"}
                                >
                                  {hr[sampleIndex]} {reading.hr_valid && reading.hr_valid[sampleIndex] ? "✓" : ""}
                                </Badge>
                              )}
                            </TableCell>
                            {/* SpO2 */}
                            <TableCell className="text-center">
                              {spo2[sampleIndex] !== undefined && spo2[sampleIndex] !== -999 && (
                                <Badge 
                                  variant="outline" 
                                  className={spo2[sampleIndex] > 0 ? "bg-blue-50 text-blue-700" : "bg-gray-50"}
                                >
                                  {spo2[sampleIndex]}% {reading.spo2_valid && reading.spo2_valid[sampleIndex] ? "✓" : ""}
                                </Badge>
                              )}
                            </TableCell>
                            {/* Temperature */}
                            <TableCell className="text-center font-mono text-xs">
                              {temp[sampleIndex] !== undefined && temp[sampleIndex].toFixed(2)}
                            </TableCell>
                            {/* Accelerometer */}
                            <TableCell className="text-center font-mono text-xs">
                              <div className="space-y-1">
                                <div>X: {accX[sampleIndex]?.toFixed(3)}</div>
                                <div>Y: {accY[sampleIndex]?.toFixed(3)}</div>
                                <div>Z: {accZ[sampleIndex]?.toFixed(3)}</div>
                              </div>
                            </TableCell>
                            {/* Gyroscope */}
                            <TableCell className="text-center font-mono text-xs">
                              <div className="space-y-1">
                                <div>X: {gyroX[sampleIndex]?.toFixed(3)}</div>
                                <div>Y: {gyroY[sampleIndex]?.toFixed(3)}</div>
                                <div>Z: {gyroZ[sampleIndex]?.toFixed(3)}</div>
                              </div>
                            </TableCell>
                            {/* Pitch */}
                            <TableCell className="text-center font-mono text-xs">
                              {combpitch[sampleIndex]?.toFixed(2)}°
                            </TableCell>
                            {/* Roll */}
                            <TableCell className="text-center font-mono text-xs">
                              {combroll[sampleIndex]?.toFixed(2)}°
                            </TableCell>
                            {/* Yaw */}
                            <TableCell className="text-center font-mono text-xs">
                              {gyaw[sampleIndex]?.toFixed(2)}°
                            </TableCell>
                            {/* IR/Red */}
                            <TableCell className="text-center font-mono text-xs">
                              <div className="space-y-1">
                                <div className="text-red-600">R: {red[sampleIndex]}</div>
                                <div className="text-gray-600">IR: {ir[sampleIndex]}</div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls at bottom */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing readings {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length}
            {expandedReadings.size > 0 && ` (${expandedReadings.size} expanded)`}
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
